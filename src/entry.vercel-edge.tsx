/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for Vercel Edge when building for production.
 *
 * Learn more about the Vercel Edge integration here:
 * - https://qwik.dev/docs/deployments/vercel-edge/
 *
 */
import {
  createQwikRouter,
  type PlatformVercel,
} from "@qwik.dev/router/middleware/vercel-edge";
import qwikRouterConfig from "@qwik-router-config";
import { manifest } from "@qwik-client-manifest";
import render from "./entry.ssr";

declare global {
  interface QwikCityPlatform extends PlatformVercel {}
}

export default createQwikRouter({ render, qwikRouterConfig, manifest });
