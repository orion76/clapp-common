import { createToken } from "./di-tokens";
import { Container, ResolutionContext, injectable, inject } from "inversify";

const CONTEXT_TOKEN = createToken('appRoot');

const contextFactory = (context: ResolutionContext) => {
  return async () => {
    // Можно выполнить асинхронную подготовку перед получением инстанса
    await someAsyncInit();
    return context.get(HeavyServiceToken);
  };
});