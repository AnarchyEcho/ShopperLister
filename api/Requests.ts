export const Request = ((method: string, item: any, quantity?: any) => {
  fetch('https://echo-restful.herokuapp.com/api/shopping', {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item: item,
      quantity: parseInt(quantity),
    }),
  });
});

export const userRequest = ((method: string, userId: any) => {
  fetch('https://echo-restful.herokuapp.com/api/shopping/users', {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uuid: userId,
    }),
  });
});
