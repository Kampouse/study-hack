/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-bg":
          "url('https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_1280.png')",
        "footer-texture": "url('/img/footer-texture.png') ",
      },
    },
  },
  plugins: [],
};
