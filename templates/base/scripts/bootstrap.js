import "../styles/index.scss";

import {
  defineCustomElements,
  applyPolyfills
} from "@weareglow/media-components/loader";

applyPolyfills().then(() => {
  defineCustomElements(window);
});
