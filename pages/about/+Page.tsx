import React from 'react';
import * as G_IconFa from 'react-icons/ci';

function Page() {
  return (
    <div className='h-auto'>
      <div className='grid grid-cols-3 gap-4'>
        {Object.keys(G_IconFa).map((key: any) => {
          const IconComponent = (G_IconFa as any)[key];
          return (
            <div key={key} className='flex flex-col gap-5 items-center'>
              <IconComponent className='text-4xl font-primary' />
              <h2 className='text-xl'>{key}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Page };