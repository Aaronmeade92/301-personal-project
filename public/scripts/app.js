'use strict'

function convertMood(mood){
  switch (mood) {
    case 'Cowabunga!':
      return 6;
      break;
    case 'Pretty Cowabunga!':
      return 5;
      break;
    case 'Almost Cowabunga!':
      return 4;
      break;
    case 'Not so Cowabunga':
      return 3;
      break;
    case 'Not Cowabunga':
      return 2;
      break;
    case 'Zero Cowabungas':
      return 1;
      break;
    default: return 0;

  }
}
