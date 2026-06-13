async function check() {
  try {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzgxMjAxMzYwLCJleHAiOjE3ODM3OTMzNjB9.oNvzOG9XZcEbBMFK-KVUuMMjJVDmsFwEom3n5vnWVbA';
    const res = await fetch('http://localhost:1337/api/reviews', {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    const data = await res.json();
    console.log('API Response status:', res.status);
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error during check:', err);
  }
}
check();
