/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader } from '@googlemaps/js-api-loader'

const apiKey = 'key'
let googleObj: any = null

function loadGoogle(): Promise<unknown> {
  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places'],
  })

  return new Promise((res: any, rej: any) => {
    if (googleObj === null) {
      loader
        .load()
        .then((google) => {
          googleObj = google
          res(googleObj)
        })
        .catch((e: unknown) => rej(e))
    } else {
      res(googleObj)
    }
  })
}

export default loadGoogle
