declare module '*.png' {
    const value: string;
    export default value;
  }

  declare module '*.svg' {
    import React from 'react';
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default content;
}