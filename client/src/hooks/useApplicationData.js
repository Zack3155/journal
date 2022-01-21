import axios from 'axios';

import { updatetDiaryById } from '../helpers/selectors';

import {
  useEffect,
  useReducer
} from 'react';

import dataReducer, {
  SET_USER
} from '../reducers/dataReducer';

const useApplicationData = () => {
  // Signup an account by given account info
  async function signup(user) {
    const timeout = setTimeout(() => {
      alert("Cannot Connect to the Server");
    }, 2000);
    return await axios.post(`http://localhost:3001/api/users`, user)
      .then(res => {
        const data = res.data;
        clearTimeout(timeout);
        if (data.msg) {
          throw new Error(data.msg);
        }
        else if (data.error) {
          throw new Error('Something wrong. Please try again!');
        }
      });
  };

  //
  async function login(email, password) {
    const timeout = setTimeout(() => {
      alert("Cannot Connect to the Server");
    }, 2000);

    return await axios.post(`http://localhost:3001/api/users/${email}`, { email, password })
      .then(res => {
        const userData = res.data;
        clearTimeout(timeout);
        if (userData.msg) {
          throw new Error(userData.msg);
        }
        else if (userData.error) {
          throw new Error('Something wrong. Please try again!');
        }
        else {
          // Get all diaries by a user
          return getDiaries(email)
            .then(diaryData => {
              if (diaryData.error) {
                throw new Error('Something wrong. Please try again!');
              }
              // set current user data and update login status
              userData['diaries'] = diaryData;
              localStorage.setItem('user', JSON.stringify(userData));
              setCurrentUserData(userData);
            });
        }
      });
  };

  //
  async function getDiaries(email) {
    return await axios
      .get(`http://localhost:3001/api/diaries/${email}`)
      .then(res => res.data);
  };

  //
  async function submitDiary(email, title, content) {
    const timeout = setTimeout(() => {
      alert("Cannot Connect to the Server");
    }, 2000);
    return await axios.post(`http://localhost:3001/api/diaries/`, { email, title, content })
      .then(res => {
        const data = res.data;
        clearTimeout(timeout);
        if (data.error) {
          throw new Error('Something wrong. Please try again!');
        }
        addUserDiary(data);
      });
  };

  async function updateDiary(email, id, title, content) {
    const timeout = setTimeout(() => {
      alert("Cannot Connect to the Server");
    }, 2000);
    return await axios.put(`http://localhost:3001/api/diaries/`, { email, id, title, content })
      .then(res => {
        const data = res.data;
        clearTimeout(timeout);
        if (data.error) {
          throw new Error('Something wrong. Please try again!');
        }
        updateUserDiary(data);
      });
  };

  function addUserDiary(diary) {
    // Copy of current user diaries
    let diaries = [...state.user.diaries];
    // Add new diary to the copy
    diaries.push(diary);
    // Update cookie and current user data
    state.user.diaries = diaries;
    localStorage.setItem('user', JSON.stringify(state.user));
    setCurrentUserData(state.user);
  };

  function updateUserDiary(diary) {
    // Copy of current user diaries
    let diaries = [...state.user.diaries];
    // Update the copy of diaries
    diaries = updatetDiaryById(diaries, diary);
    // Update cookie and current user data
    state.user.diaries = diaries;
    localStorage.setItem('user', JSON.stringify(state.user));
    setCurrentUserData(state.user);
  };


  //
  function logout() {
    dispatch({
      type: SET_USER,
      user: {},
      isLoggedin: false
    });
    localStorage.clear();
  };

  //
  function setCurrentUserData(userData) {
    dispatch({
      type: SET_USER,
      user: userData,
      isLoggedin: true
    })
  };

  const [state, dispatch] = useReducer(dataReducer, {
    user: {},
    diaries: [],
    isLoggedin: false,
    weekendsVisible: true,
    currentEvents: []
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUserData(JSON.parse(user));
    }
  }, []);

  //console.log(state.user, state.isLoggedin);
  return { state, signup, login, logout, submitDiary, updateDiary }
};

export default useApplicationData;