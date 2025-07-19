/// <reference types="vite/client" />

// Declaración para módulos CSS
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declaración para módulos SCSS/SASS
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Declaración para módulos LESS
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}
