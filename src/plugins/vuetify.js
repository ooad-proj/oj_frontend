import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#009688',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#B91C1C',
      },
    },
  },
});
