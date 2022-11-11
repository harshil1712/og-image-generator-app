import React from 'react';
import { Button } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

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