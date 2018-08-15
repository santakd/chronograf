export interface QueryRequest {
  id: string
  type: 'QUERY'
  data: {
    query: string
  }
}

export interface QueryResponse {
  id: string
  type: 'QUERY_RESULT'
  done: boolean
  data: {
    column: string
  }
}

export interface ErrorResponse {
  id: string
  type: 'ERROR'
  done: boolean
  data: {
    message: string
  }
}

export type JSONResponse = QueryResponse | ErrorResponse

export type DataResponse = Float64Array

export interface Timeseries {
  [columnKey: string]: Float64Array
}