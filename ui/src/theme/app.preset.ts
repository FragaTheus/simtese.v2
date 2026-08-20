import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e9f5fa',
      100: '#d2ebf5',
      200: '#bceafd',
      300: '#a0cde0',
      400: '#79a5b7',
      500: '#376474',
      600: '#1d4c5c',
      700: '#033b4a',
      800: '#002f3d',
      900: '#00242f',
      950: '#001f28',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fafb',
          100: '#f2f4f5',
          200: '#eceeef',
          300: '#e6e8e9',
          400: '#e1e3e4',
          500: '#c0c8cb',
          600: '#71787c',
          700: '#41484b',
          800: '#2e3132',
          900: '#191c1d',
          950: '#1a1f2b',
        },

        primary: {
          color: '#00242f',
          contrastColor: '#ffffff',
          hoverColor: '#033b4a',
          activeColor: '#1d4c5c',
        },

        highlight: {
          background: '#bceafd',
          focusBackground: '#a0cde0',
          color: '#00242f',
          focusColor: '#001f28',
        },

        text: {
          color: '#191c1d',
          hoverColor: '#1a1f2b',
          mutedColor: '#71787c',
          hoverMutedColor: '#41484b',
        },

        content: {
          background: '#ffffff',
          hoverBackground: '#f2f4f5',
          borderColor: '#e2e8f0',
          color: '#191c1d',
          hoverColor: '#1a1f2b',
        },

        formField: {
          background: '#ffffff',
          disabledBackground: '#f2f4f5',
          filledBackground: '#f8fafb',
          filledHoverBackground: '#f2f4f5',
          filledFocusBackground: '#ffffff',
          borderColor: '#e2e8f0',
          hoverBorderColor: '#c0c8cb',
          focusBorderColor: '#00242f',
          invalidBorderColor: '#ba1a1a',
          color: '#191c1d',
          disabledColor: '#71787c',
          placeholderColor: '#71787c',
          invalidPlaceholderColor: '#ba1a1a',
        },
      },
    },
  },
});

export default AppPreset;
