import React, { ReactNode } from 'react';

interface RendererContainerProps {
  title: string;
  children: ReactNode;
}

export default function RendererContainer({ title, children }: RendererContainerProps) {
  return (
    <div className="render-area-item">
      <h3>{title}</h3>
      {children}
    </div>
  );
}
