### Get started using this Blob Storage by following the steps in one of these guides.
---
#### 1、Prepare your local project
Run "vercel env pull .env.development.local" to make the latest environment variables available to your project locally.

---
#### 2、Install  package
Then run “npm install @vercel/blob” to install the Vercel Blob SDK.

---
#### 3、Use in code
When you need to upload files larger than 4.5 MB, you can use client uploads. In this case, the file is sent directly from the client (a browser in this example) to Vercel Blob. This transfer is done securely as to not expose your Vercel Blob store to anonymous uploads. The security mechanism is based on a token exchange between your server and Vercel Blob.

##### 3.1 Create a client upload page
This page allows to upload files to Vercel Blob. The files will go directly from the browser to Vercel Blob without going through your server.

Behind the scenes, the upload is done securely by exchanging a token with your server before uploading the file.
```src/app/avatar/upload/page.tsx
'use client';
 
import { type PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';
 
export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <>
      <h1>Upload Your Avatar</h1>
 
      <form
        onSubmit={async (event) => {
          event.preventDefault();
 
          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }
 
          const file = inputFileRef.current.files[0];
 
          const newBlob = await upload(file.name, file, {
            access: 'public',
            handleUploadUrl: '/api/avatar/upload',
          });
 
          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
```
##### 3.2 Create a client upload route
The responsibility of this client upload route is to:

Generate tokens for client uploads
Listen for completed client uploads, so you can update your database with the URL of the uploaded file for example
The @vercel/blob npm package exposes a helper to implement said responsibilities.
```src/app/api/avatar/upload/route.ts
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
 
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
 
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
 
        console.log('blob upload completed', blob, tokenPayload);
 
        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}

```
---
#### 4、Testing your page
Run your application locally and visit /avatar/upload to upload the file to your store. The browser will display the unique URL created for the file.

When your local website is served on http://localhost:3000, then the onUploadCompleted step won't succeed as Vercel Blob cannot contact your localhost. Instead, we recommend you run your local application through a tunneling service like ngrok, so you can experience the full Vercel Blob development flow locally.