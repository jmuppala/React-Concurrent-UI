import React, { unstable_useTransition } from "react";
import { useQuery, queryCache } from "react-query";
import { useErrorHandler } from 'react-error-boundary';
import { fetchUsers, fetchAlbums } from '../shared/dataOperations';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LoadingComponent from './LoadingComponent';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      '& .Mui-selected': {
          backgroundColor: theme.palette.primary.dark,
          color: 'white'
      }
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    listItem: {
        backgroundColor: theme.palette.primary.light,
        borderRadius: 10,
        margin: theme.spacing(1, 0.25, 2, 0.25)
    },
    title: {
        margin: theme.spacing(0, 2)
    }
  }));

export default function UserList({ selectedUser, setSelectedUser, setSelectedAlbum }) {
  const classes = useStyles();
  const [startTransition, isPending] = unstable_useTransition({ timeoutMs: 10000 });

  const handleListItemClick = (event, id) => {
    startTransition(() => {
      console.log("user Id: ", + id);
      queryCache.prefetchQuery(["albums", id], fetchAlbums);
      setSelectedUser(id);
      setSelectedAlbum(null);
    });
  };

  const { isError, data, error } = useQuery('users', fetchUsers);

  useErrorHandler(error);

  console.log("selected User ", selectedUser);
  console.log('isError: ', isError, 'data: ', data, 'error: ', error);
  
  if (!isError)
    return (
      <div className={classes.root}>
        <h2>Users</h2> 
        <GridList className={classes.gridList} cols={2.5} cellHeight='auto' spacing={20}>
          {data.map((user) => (
            <ListItem key={user.id} className={classes.listItem}
              button disabled={isPending}
              selected={selectedUser === user.id}
              onClick={(event) => handleListItemClick(event, user.id)}
            >
              <ListItemText className={classes.title} primary={user.name} />
            </ListItem>
          ))}
        </GridList>
        <div>
          {isPending ? <LoadingComponent size={20} message={'Refreshing'} /> : null}
        </div>
      </div>
    );
  else return(<div></div>);
}