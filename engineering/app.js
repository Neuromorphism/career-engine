import { installEngineeringEdition } from './install.js';
installEngineeringEdition();
// Load the engine after installing the edition so discovery indexes every specialty.
const { startCareerApp } = await import('../src/app.js?v=0.11.1');
const { showLoadError } = await import('../src/career-ui.js?v=0.11.1');
try { startCareerApp({ mode: 'engineering' }); } catch (error) { showLoadError(error); }
