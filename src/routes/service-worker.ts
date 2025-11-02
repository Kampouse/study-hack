/*
 * WHAT IS THIS FILE?
 *
 * The service-worker.ts file is used to have state of art prefetching.
 * https://qwik.dev/qwikcity/prefetching/overview/
 *
 * Qwik uses a service worker to speed up your site and reduce latency, ie, not used in traditional way of offline.
 * You can also use this file to add more functionality that runs in service worker.
 */
/// <reference lib="webworker" />
import { setupServiceWorker } from '@builder.io/qwik-city/service-worker'

setupServiceWorker()

self.addEventListener('install', event => {
  ;(self as any).skipWaiting()
})

self.addEventListener('activate', event => {
  ;(self as any).clients.claim()
})
