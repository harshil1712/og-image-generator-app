import React, { useEffect, useState } from 'react';
import { Button } from '@contentful/f36-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { useCMA, useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import satori from 'satori';
import '../style.css'
const toImg = require('react-svg-to-image')

declare global {
  interface Window {
    __resource?: any;
  }
}

const Dialog = () => {
  const sdk = useSDK();
  const cma = useCMA();
  useAutoResizer();

  const [svgHtml, setSvgHtml] = useState<any>();

  useEffect(()=>{
    const generateOg = async () =>{
      if (window === undefined) return []
      const [font, fontBold, fontIcon, Segmenter] = 
      window.__resource ||
      (window.__resource = await Promise.all([
        fetch('/inter-latin-ext-400-normal.woff').then((res) =>
          res.arrayBuffer()
        )
      ]));
      const svg = await satori(
        <div style={{ backgroundColor:'black', color:'white' }}>hello, world</div>,
        {
          width: 600,
          height: 400,
          fonts: [
            {
              name: 'Roboto',
              data: font,
            }
          ],
        },
      )
      return svg;
    };
    generateOg().then(setSvgHtml);
  })

  const handleClick = async () => {
    const pngImage = await toImg('svg', 'name', {
      scale: 1,
      download: false,
    });
    const fileName = 'example.png'
    const fileType = 'image/png'
    const fetchImage = await fetch(pngImage);
    const pngData = await fetchImage.arrayBuffer();
    const pngFile = await new File([pngData], fileName, {type: fileType});
    const {sys} = await cma.space.get({});
    const {id} = await sys;

    const linkAsset = await cma.asset.createFromFiles({
      spaceId: id
    },
    {
      fields: {
        title: {
          "en-US": id
        },
        description: {
          "en-US": ""
        },
        file: {
          'en-US': {
            file: pngData,
            fileName: fileName,
            contentType: 'image/png',
          }
        }
      }
    }
    )

    const processImage = await cma.asset.processForAllLocales({spaceId:id}, linkAsset)
    };

  return (
    <>
    <div
      dangerouslySetInnerHTML={
        {__html: `${svgHtml}`}
      }
      className="og-container"
    ></div>
    <Button onClick={handleClick}>Add</Button>
    </>
  );
};

export default Dialog;
