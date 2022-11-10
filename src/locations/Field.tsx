import React from 'react';
import { Paragraph, Button } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useCMA, useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();
  // If you only want to extend Contentful's default editing experience
  // reuse Contentful's editor components
  // -> https://www.contentful.com/developers/docs/extensibility/field-editors/
  const handleClick = () => {
    sdk.dialogs.openCurrentApp({
      position: 'center',
      title: 'Generate OG Image',
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
      width: 500,
      allowHeightOverflow: true
    })
  }
  return <Button onClick={handleClick}>Generate OG Image</Button>;
};

export default Field;
