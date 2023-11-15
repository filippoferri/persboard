module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
      // HOST
      NEXT_PUBLIC_HOST_API_KEY: 'http://localhost:3034',
      // OPENAI HOST
      NEXT_PUBLIC_HOST_API_OPENAI: 'https://api.openai.com/v1',
      // FIREBASE
      NEXT_PUBLIC_FIREBASE_API_KEY: 'AIzaSyBVURb8XDIBOYiqOPVygyrLxf4kqFImzRQ',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'personalboard-1d224.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'personalboard-1d224',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'personalboard-1d224.appspot.com',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '799906007717',
      NEXT_PUBLIC_FIREBASE_APPID: '1:799906007717:web:7e5b403b1fb6d304f11b4c',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-JL556Z4BHW',
      // OPENAI
      NEXT_PUBLIC_OPENAI_API_KEY: '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',
      // STRIPE
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_51MjzRrIvN6LsMTsIu9P5M4HXrqPutiUGdTLmkr0AGR50bNjolAasj6o93uvXp7uT5btumxQaz3nzBt8V710tE7jt0012UC1H2T',
      NEXT_PUBLIC_STRIPE_SECRET_KEY: 'sk_test_51MjzRrIvN6LsMTsIcF8LmB79SrsoY487oBMjc0nusCC1Oc3O958NyBjK6RcGbx4LKXFvgNNoiMoPvvQIaNSYEmBN00L7zi23Pg',
  },
  webpack: (config) => {
      config.experiments = {
          asyncWebAssembly: true,
          layers: true,
      };

      return config;
  },
};