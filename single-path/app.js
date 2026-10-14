import { startCareerApp } from '../src/app.js?v=0.9.0';
import { showLoadError } from '../src/career-ui.js?v=0.9.0';
try { startCareerApp({ mode: 'single' }); } catch (error) { showLoadError(error); }
