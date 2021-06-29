import { conditionalExpression } from "@babel/types";
import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts()); // dispatch the fetchPost -> "await" to make sure to wait till fetchPost is complete
  // 1 -> getState().posts has all the posts
  // use map from lodash and iterate over it and find unique userId's
  const userIds = _.uniq(_.map(getState().posts, "userId"));
  // iterate over all the unique userIds and use fetchUser to fetch the data and since no computation has to be done with that data so we don't need await over here.
  userIds.forEach((id) => dispatch(fetchUser(id)));

  // above steps from line 9 can be minimized using _.chain and .value is written as execute

  // _.chain(getState().props)
  //   .map('userId')
  //     .uniq()
  //       .forEach(id=>dispatch(fetchUser(id)))
  //         .value();
};
export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};

// MEMOIZED VERSION OF fetch users
// export const fetchUser = (id) => dispatch =>  _fetchUser(id,dispatch);

// const _fetchUser = _.memoize(async(id,dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);
//   dispatch({ type: "FETCH_USER", payload: response.data });
// });
