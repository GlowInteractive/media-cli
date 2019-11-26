import "normalize.css/normalize.css";
import "../styles/index.scss";

import {
  defineCustomElements,
  applyPolyfills
} from "@weareglow/media-components/loader";

applyPolyfills();
defineCustomElements(window);
