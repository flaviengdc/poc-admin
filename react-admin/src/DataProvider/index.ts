import { stringify } from "query-string";
import { DataProvider, fetchUtils } from "ra-core";

/**
 * Maps react-admin queries to a simple REST API
 *
 * This REST dialect is similar to the one of FakeRest
 *
 * @see https://github.com/marmelab/FakeRest
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider('http://path.to.my.api/')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson,
  countHeader?: string
): DataProvider => ({
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const rangeStart = (page - 1) * perPage;
    const rangeEnd = page * perPage - 1;

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([rangeStart, rangeEnd]),
      filter: JSON.stringify(params.filter),
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const res = await fetch(url, {
      headers: {
        "xc-auth":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpZW5AZ2Vuc2RlY29uZmlhbmNlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfeDB4b2V6dXhjOHNoZDIiLCJyb2xlcyI6InVzZXIsc3VwZXIiLCJ0b2tlbl92ZXJzaW9uIjoiNDY5ODMwY2NhY2U4MTQ2MzAxNjcyMjcyNGFkYmE5MjQzNWRmOTQ2MWM1NWZjYjkxYmNmYzU5NjY3ZmM0NjY1MTc0ZmI4ZThjMmFkMmIzZTUiLCJpYXQiOjE2NjkxMTE0OTYsImV4cCI6MTY2OTE0NzQ5Nn0.SIzyICsMEahl_Zvq_PnB2czVkpaFQ0pA8fMsyjDHaKs",
      },
    });

    const jsonRes = await res.json();

    return {
      data: jsonRes.list.map(({ Id, ...itemWithoutId }: any) => ({
        id: Id,
        ...itemWithoutId,
      })),
      total: jsonRes.pageInfo.totalRows,
    };
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const rangeStart = (page - 1) * perPage;
    const rangeEnd = page * perPage - 1;

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const options =
      countHeader === "Content-Range"
        ? {
            // Chrome doesn't return `Content-Range` header if no `Range` is provided in the request.
            headers: new Headers({
              Range: `${resource}=${rangeStart}-${rangeEnd}`,
            }),
          }
        : {};

    return httpClient(url, options).then(({ headers, json }) => {
      if (!headers.has(countHeader)) {
        throw new Error(
          `The ${countHeader} header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare ${countHeader} in the Access-Control-Expose-Headers header?`
        );
      }
      return {
        data: json,
        total:
          countHeader === "Content-Range"
            ? parseInt(headers.get("content-range").split("/").pop(), 10)
            : parseInt(headers.get(countHeader.toLowerCase())),
      };
    });
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json })),

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "xc-auth":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpZW5AZ2Vuc2RlY29uZmlhbmNlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfeDB4b2V6dXhjOHNoZDIiLCJyb2xlcyI6InVzZXIsc3VwZXIiLCJ0b2tlbl92ZXJzaW9uIjoiNDY5ODMwY2NhY2U4MTQ2MzAxNjcyMjcyNGFkYmE5MjQzNWRmOTQ2MWM1NWZjYjkxYmNmYzU5NjY3ZmM0NjY1MTc0ZmI4ZThjMmFkMmIzZTUiLCJpYXQiOjE2NjkxMTE0OTYsImV4cCI6MTY2OTE0NzQ5Nn0.SIzyICsMEahl_Zvq_PnB2czVkpaFQ0pA8fMsyjDHaKs",
      },
    });

    const jsonRes = await res.json();

    console.log(jsonRes);
    return {
      data: [] as any,
    };
  },

  // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) => {
        const url = `${apiUrl}/${resource}/${id}`;

        return fetch(url, {
          method: "DELETE",
          headers: {
            "xc-auth":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZsYXZpZW5AZ2Vuc2RlY29uZmlhbmNlLmNvbSIsImZpcnN0bmFtZSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImlkIjoidXNfeDB4b2V6dXhjOHNoZDIiLCJyb2xlcyI6InVzZXIsc3VwZXIiLCJ0b2tlbl92ZXJzaW9uIjoiNDY5ODMwY2NhY2U4MTQ2MzAxNjcyMjcyNGFkYmE5MjQzNWRmOTQ2MWM1NWZjYjkxYmNmYzU5NjY3ZmM0NjY1MTc0ZmI4ZThjMmFkMmIzZTUiLCJpYXQiOjE2NjkxMTE0OTYsImV4cCI6MTY2OTE0NzQ5Nn0.SIzyICsMEahl_Zvq_PnB2czVkpaFQ0pA8fMsyjDHaKs",
          },
        })
          .then((res) => res.json())
          .then((jsonRes) => {
            return jsonRes;
          });
      })
    ).then((responses) => ({
      data: responses.map((item) => {
        return {
          ...item,
        };
      }),
    })),
});
