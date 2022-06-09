async function getPosts() {
  const response = await fetch('http://jsonplaceholder.typicode.com/posts');
  const posts = await response.json();
  return posts;
}

async function getUsers() {
  const response = await fetch('http://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  return users;
}

async function getComments(postId) {
  const response = await fetch(`http://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  const comments = await response.json();
  return comments;
}

async function getRequiredData() {
  const users = await getUsers();
  const posts = await getPosts();
  const SELECTED_NAME = 'Ervin Howell';
  const selectedUser = users.find(user => user.name === SELECTED_NAME);
  let resultArray = []
  let postObj = {}

  posts.forEach(({title, id, body, userId}) => {
    let title_crop = `${title.slice(0, 20)}...`;
    let comments = [];

    if (selectedUser && selectedUser.id === userId) {
      getComments(id).then(res => comments.push(...res));
    }

    let resultPost = {
        id,
        title,
        title_crop, 
        body,
        comments,
    }  

    if (selectedUser && selectedUser.id !== userId) {
      const {comments, ...rest} = resultPost
      resultPost = rest
    }

    try {
      postObj[userId].push(resultPost)
    } catch {
      postObj[userId] = [resultPost]
    }
  }),

  users.forEach((user) => {
    const {address: {city, street, suite}, id, name, email, company} = user;

    let website = `https://${user.website}`;
    let address = `${city}, ${street}, ${suite}`;
    let resultUser  = {
      id,
      name,
      email,
      website,
      company: company.name,
      address,
      posts: postObj[id],
    }
    resultArray.push(resultUser)
  });
  return resultArray;
}

getRequiredData().then(res => console.log(res));
