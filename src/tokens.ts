import { ServiceIdentifier } from "inversify";

/**
 * Injection token of the shared asynchronous event bus registered by `Clapp`.
 */
export const EVENT_BUS_TOKEN = Symbol('clapp.event.bus');
export const APP_RESOLVER = Symbol('APP_RESOLVER')

export type TAppResolver = <T>(token: ServiceIdentifier<T>) => T;
export type TAppResolverFactory = () => TAppResolver;
