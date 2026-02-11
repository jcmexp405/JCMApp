// src/constants/categoryIcons.ts
import {
  faBuilding,
  faFolder,
  faFileLines,
  faTags,
  faShieldHalved,
  faBriefcase,
  faUsers,
  faGear,
  faChartLine,
  faFileInvoice,
  faFileInvoiceDollar,
  faFile,
  faFilePen,
  faLandmark,
  faIdCard,
  faHouse,
  faHospital
} from '@fortawesome/free-solid-svg-icons';

export const CATEGORY_ICON_MAP = {
  faBuilding,
  faFolder,
  faFileLines,
  faTags,
  faShieldHalved,
  faBriefcase,
  faUsers,
  faGear,
  faChartLine,
  faFileInvoice,
  faFileInvoiceDollar,
  faFile,
  faFilePen,
  faLandmark,
  faIdCard,
  faHouse,
  faHospital
};

// Para iterar opciones en el Select:
export const CATEGORY_ICON_OPTIONS = Object.keys(CATEGORY_ICON_MAP);
// => ["faBuilding", "faFolder", ...]
