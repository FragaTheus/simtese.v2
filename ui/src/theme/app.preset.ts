import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const AppPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '2px',
      md: '4px',
      lg: '4px',
      xl: '8px',
    },
  },

  semantic: {
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '#006e2f',
      offset: '2px',
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
          900: '#1a2130',
          950: '#191c1d',
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
          color: '#001f28',
          focusColor: '#00242f',
        },

        formField: {
          background: '#ffffff',
          disabledBackground: '#eceeef',
          filledBackground: '#f8fafb',
          filledHoverBackground: '#f2f4f5',
          filledFocusBackground: '#ffffff',

          borderColor: '#E2E8F0',
          hoverBorderColor: '#71787c',
          focusBorderColor: '#006e2f',
          invalidBorderColor: '#ba1a1a',

          color: '#1A1F2B',
          disabledColor: '#71787c',
          placeholderColor: '#71787c',
          invalidPlaceholderColor: '#ba1a1a',

          floatLabelColor: '#71787c',
          floatLabelFocusColor: '#006e2f',
          floatLabelActiveColor: '#41484b',
          floatLabelInvalidColor: '#ba1a1a',

          iconColor: '#71787c',
        },

        text: {
          color: '#1A1F2B',
          hoverColor: '#191c1d',
          mutedColor: '#71787c',
          hoverMutedColor: '#41484b',
        },

        content: {
          background: '#ffffff',
          hoverBackground: '#f2f4f5',
          borderColor: '#E2E8F0',
          color: '#1A1F2B',
          hoverColor: '#191c1d',
        },

        overlay: {
          select: {
            background: '#ffffff',
            borderColor: '#E2E8F0',
            color: '#1A1F2B',
          },

          popover: {
            background: '#ffffff',
            borderColor: '#E2E8F0',
            color: '#1A1F2B',
          },

          modal: {
            background: '#ffffff',
            borderColor: '#E2E8F0',
            color: '#1A1F2B',
          },
        },

        list: {
          option: {
            focusBackground: '#f2f4f5',
            selectedBackground: '#bceafd',
            selectedFocusBackground: '#a0cde0',

            color: '#1A1F2B',
            focusColor: '#191c1d',

            selectedColor: '#001f28',
            selectedFocusColor: '#00242f',

            icon: {
              color: '#71787c',
              focusColor: '#41484b',
            },
          },

          optionGroup: {
            background: 'transparent',
            color: '#71787c',
          },
        },

        navigation: {
          item: {
            focusBackground: '#f2f4f5',
            activeBackground: '#eceeef',

            color: '#1A1F2B',
            focusColor: '#191c1d',
            activeColor: '#00242f',

            icon: {
              color: '#71787c',
              focusColor: '#41484b',
              activeColor: '#00242f',
            },
          },

          submenuLabel: {
            background: 'transparent',
            color: '#71787c',
          },

          submenuIcon: {
            color: '#71787c',
            focusColor: '#41484b',
            activeColor: '#00242f',
          },
        },
      },
    },

    formField: {
      borderRadius: '4px',

      focusRing: {
        width: '2px',
        style: 'solid',
        color: '#006e2f',
        offset: '0',
        shadow: 'none',
      },
    },

    content: {
      borderRadius: '4px',
    },

    overlay: {
      select: {
        borderRadius: '4px',
      },

      popover: {
        borderRadius: '4px',
      },

      modal: {
        borderRadius: '8px',
      },
    },
  },

  extend: {
    app: {
      colors: {
        tertiary: '#1a2130',
        tertiaryFixedDim: '#bfc6db',

        surfaceBright: '#f8fafb',
        surfaceBorder: '#E2E8F0',
        surfaceDim: '#d8dadb',
        surfaceContainerLowest: '#ffffff',
        surfaceContainerLow: '#f2f4f5',
        surfaceContainer: '#eceeef',
        surfaceContainerHigh: '#e6e8e9',
        surfaceContainerHighest: '#e1e3e4',
        surfaceVariant: '#e1e3e4',

        primary: '#00242f',
        primaryContainer: '#033b4a',
        primaryFixed: '#bceafd',
        primaryFixedDim: '#a0cde0',
        inversePrimary: '#a0cde0',
        onPrimary: '#ffffff',
        onPrimaryContainer: '#79a5b7',
        onPrimaryFixed: '#001f28',
        onPrimaryFixedVariant: '#1d4c5c',

        secondary: '#006e2f',
        secondaryContainer: '#92f5a2',
        secondaryFixed: '#95f8a5',
        secondaryFixedDim: '#79db8b',
        onSecondary: '#ffffff',
        onSecondaryContainer: '#007231',
        onSecondaryFixed: '#002109',
        onSecondaryFixedVariant: '#005322',

        tertiaryContainer: '#2f3646',
        tertiaryFixed: '#dce2f7',
        onTertiary: '#ffffff',
        onTertiaryContainer: '#989fb2',
        onTertiaryFixed: '#141b2b',
        onTertiaryFixedVariant: '#404758',

        error: '#ba1a1a',
        errorContainer: '#ffdad6',
        onError: '#ffffff',
        onErrorContainer: '#93000a',

        background: '#f8fafb',
        surface: '#f8fafb',
        onBackground: '#191c1d',
        onSurface: '#191c1d',
        onSurfaceVariant: '#41484b',

        inverseSurface: '#2e3132',
        inverseOnSurface: '#eff1f2',

        outline: '#71787c',
        outlineVariant: '#c0c8cb',
        surfaceTint: '#376474',

        clinicalTeal: '#0E6B7E',
        graphiteText: '#1A1F2B',
      },

      radius: {
        default: '2px',
        lg: '4px',
        xl: '8px',
        full: '12px',
        roundFour: '4px',
      },

      spacing: {
        marginDesktop: '40px',
        stackSm: '12px',
        stackLg: '48px',
        marginMobile: '16px',
        stackMd: '24px',
        gutter: '24px',
        containerMax: '1280px',
        base: '8px',
      },

      typography: {
        labelSm: {
          fontFamily: 'Inter',
          fontSize: '12px',
          lineHeight: '16px',
          fontWeight: '600',
        },

        displayLg: {
          fontFamily: 'Manrope',
          fontSize: '48px',
          lineHeight: '56px',
          letterSpacing: '-0.02em',
          fontWeight: '700',
        },

        headlineMd: {
          fontFamily: 'Manrope',
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: '600',
        },

        bodyLg: {
          fontFamily: 'Inter',
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: '400',
        },

        titleLg: {
          fontFamily: 'Manrope',
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: '600',
        },

        headlineLg: {
          fontFamily: 'Manrope',
          fontSize: '32px',
          lineHeight: '40px',
          letterSpacing: '-0.01em',
          fontWeight: '700',
        },

        bodyMd: {
          fontFamily: 'Inter',
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: '400',
        },

        headlineLgMobile: {
          fontFamily: 'Manrope',
          fontSize: '28px',
          lineHeight: '36px',
          fontWeight: '700',
        },

        labelMd: {
          fontFamily: 'Inter',
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0.01em',
          fontWeight: '500',
        },
      },
    },
  },
});

export default AppPreset;
