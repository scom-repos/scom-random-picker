import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export const spinActionStyle = Styles.style({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  width: '5rem',
  height: '5rem',
  display: 'flex',
  border: 0,
  borderRadius: '50%',
  fontSize: '1rem',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  outline: 'none',
  background: Theme.colors.primary.main,
  $nest: {
    '&.disabled': {
      background: Theme.colors.primary.main,
      opacity: 1
    }
  }
})

export const markerStyle = Styles.style({
  width: '3rem',
  height: '3rem',
  clipPath: 'polygon(50% 0, 100% 50%, 0 50%)',
  background: Theme.colors.primary.main,
  position: 'absolute',
  top: 'calc(50% - 40px)',
  left: '50%',
  transform: 'translate(-50%, calc(-50% + 8px))',
  cursor: 'pointer',
  zIndex: 1,
  $nest: {
    '&.disabled': {
      opacity: 1,
      cursor: 'not-allowed'
    }
  }
})

export const wheelStyle = Styles.style({
  height: '100%',
  position: 'relative',
  borderRadius: '50%',
  overflow: 'hidden',
  transition: 'transform 3s ease'
})

export const itemStyle = Styles.style({
  width: '50%',
  position: 'absolute',
  transformOrigin: 'center right',
  zIndex: 1
})

export const textCenterStyle = Styles.style({
  textAlign: 'center'
})
