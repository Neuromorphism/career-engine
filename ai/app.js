import { startCareerApp } from '../src/app.js?v=0.11.0';
import { showLoadError } from '../src/career-ui.js?v=0.11.0';
try { startCareerApp({ mode: 'ai' }); } catch (error) { showLoadError(error); }
