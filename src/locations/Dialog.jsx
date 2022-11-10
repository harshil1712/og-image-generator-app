import React, { useEffect, useState } from 'react';
import { Button } from '@contentful/f36-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { useCMA, useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import satori from 'satori';
import '../style.css'
import toImg from 'react-svg-to-image';

const Dialog = () => {
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  const cma = useCMA();
  // const space = cma.
  // console.log(space);
  useAutoResizer();

  const [svgHtml, setSvgHtml] = useState('');

  useEffect(()=>{
    const generateOg = async () =>{
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
    const {sys} = await cma.space.get();
    const {id} = await sys;

    console.log(pngImage)

    const upload = await cma.upload.create({
      spaceId: id
    },
    {
      file: pngData
    });

    const linkAsset = await cma.asset.create({
      spaceId: id
    },
    {
      fields: {
        title: {
          "en-US": id
        },
        file: {
          'en-US': {
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: upload.sys.id
              }
            },
            contentType: 'image/png',
            // upload: pngImage
          }
        }
      }
    }
    )


    const {sys:assetSys} = await linkAsset;
    const {id:assetId} = await assetSys;
    console.log(await linkAsset);
    //const processImage = await cma.asset.processForAllLocales({spaceId:id}, linkAsset, 'en-US')
    // const publishImage = await processImage.publish();
    //console.log(processImage)
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
