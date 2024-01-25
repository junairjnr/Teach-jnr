This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

PWA--

#-Install PWABuilder Studio Extension
#-npm install next-pwa
#-reffer nexj.config.js
#-https://www.simicart.com/manifest-generator.html/
#-the manifest file paste in public folder
#-Add in layout page--
export const metadata = {
title: "Schola Teacher",
description: "Generated by Datastone Solutions",
manifest:"/manifest.json"
};

#-

## generating playstore publish build

https://developers.google.com/codelabs/pwa-in-play#0
install bubblewrap : npm i -g @bubblewrap/cli

### if not working need to change permission of nodemodule to local user

# in this command 501 is user uid , to get uid user command id in terminal

sudo chown -R 501 /usr/local/lib/node_modules
sudo chown 501 /usr/local/bin

## init bubblewarp android porject

$ bubblewrap init --manifest=https://mis.schola.in/manifest.json

# bundle id : com.datastone.scholateacherce6ee4ff

password : teacher@2018
alias : my-alias

bublewrap build

# add SHA256 fingerprint copied from playstore

bubblewrap fingerprint add E9:C3:28:A8:D3:45:06:5D:9C:D9:1E:B2:13:F2:EF:EE:22:DA:20:4E:55:CB:FB:54:8E:93:D7:CF:EA:80:26:B1
