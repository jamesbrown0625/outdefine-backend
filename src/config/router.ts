export const getHandlerPath = (serviceName) => {
  return `src/controller/${serviceName}`;
};

export const getRoutePath = (str: string) => {
  return `outdefine/${str}`;
};

export const getRootPath = () => {
  return `outdefine`;
};
