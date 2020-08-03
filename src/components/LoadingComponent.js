import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

function LoadingComponent( { message, size=40 }) {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <CircularProgress size={size} />
        <p>{message} . . .</p>
      </div>
    );
};

export default LoadingComponent;