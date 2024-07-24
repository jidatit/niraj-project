import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { formatTimeSince } from '../../utils/helperSnippets';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getDocs, collection, where, query } from 'firebase/firestore';
import { db } from '../../../db';

const StyledMenu = styled((props) => (
  <Menu
    elevation={8}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    position: 'absolute',
    maxHeight: "500px",
    overflowY: "auto",
    top: '60px',
    left: '700px',
    width: '30%',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&.MuiMenuItem-root': {
    color: '#333',
    height: "auto",
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    '& .MuiTouchRipple-root': {
      color: '#333',
    },
  },
}));

function StickyTitle() {

  const [Reminders, setReminders] = useState([])

  const getAllReminders = async (email) => {
    try {
      const remindersRef = collection(db, "reminders");
      const q = query(remindersRef,
        where("user.email", "==", email),
        where("fulfilled", "==", false));
      const querySnapshot = await getDocs(q);

      let reminders = [];
      querySnapshot.forEach((doc) => {
        const reminder = {
          id: doc.id,
          ...doc.data()
        };
        reminders.push(reminder);
      });
      setReminders(reminders);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentUser) {
      getAllReminders(currentUser.email);
    }
  }, []);

  const { currentUser } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className="flex-grow text-gray-800">
        <header className="flex items-center h-20 px-6 sm:px-10 bg-white">
          <div className="flex flex-shrink-0 items-center ml-auto">
            <button className="inline-flex items-center p-2 hover:bg-gray-100 focus:bg-gray-100 rounded-lg">
              <span className="sr-only">User Menu</span>

              <div className="hidden md:flex md:flex-col md:items-end md:leading-tight">
                {currentUser.data ? (
                  <>
                    <span className="font-semibold">{currentUser.data.name || "Grace Simmons"}</span>
                    {currentUser.data?.occupation && (<span className="text-sm text-gray-600">
                      {currentUser.data?.occupation ? currentUser.data.occupation : (
                        <div className="bg-transparent rounded-lg w-[150px] shadow-md pt-1 pb-1 pl-2 animate-pulse">
                          <div className="w-[90%] h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="w-[90%] h-2 bg-gray-300 rounded mb-2"></div>
                        </div>
                      )}
                    </span>)}
                  </>
                ) : (
                  <div className="bg-white flex flex-col justify-center items-center rounded-lg w-[150px] shadow-md pt-1 pb-1 animate-pulse">
                    <div className="w-[90%] h-4 bg-gray-300 rounded"></div>
                  </div>
                )}
              </div>
            </button>
            <div className="ml-3 space-x-1">
              <IconButton
                aria-label="show notifications"
                aria-controls="notifications-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Badge badgeContent={Reminders && Reminders.length} color="warning">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <StyledMenu
                id="notifications-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {Reminders.length > 0 && Reminders.map((reminder, index) => (
                  <Link key={index} className='w-full' to={`/user_portal/upload_inspections/?type=${reminder.policyType}&id=${reminder.req_qid}&r_id=${reminder.id}`}>
                    <StyledMenuItem sx={{ display: 'flex', flexDirection: "column", justifyContent: "start", gap: "10px" }} key={index} onClick={handleMenuClose}>
                      <div className='w-full flex flex-row gap-1 justify-end items-center'>
                        <AccessTimeIcon fontSize='15px' />
                        <p className='text-[13px]'>{formatTimeSince(reminder.reminderCreatedAt)}</p>
                      </div>
                      <div className='flex w-full flex-row justify-start items-center gap-[10px] relative'>
                        <FileUploadIcon />
                        Reminder for inspections upload
                      </div>
                    </StyledMenuItem>
                  </Link>
                ))}
                {Reminders.length === 0 && (
                  <MenuItem>No New Notifications.</MenuItem>
                )}
              </StyledMenu>
            </div>
            <div className="border-l pl-3 ml-3 space-x-1">
              <Link to="/user_portal/logout">
                <button className="relative p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:bg-gray-100 focus:text-gray-600 rounded-full">
                  <span className="sr-only">Log out</span>
                  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default StickyTitle;
