const Home = () => {
  return (
    `<nav id="main-nav" class="container">
      <a class="nav-item" href="/audio">
        <img src="/static/assets/audioRec.png" />
        Audio Record
      </a>
      <a class="nav-item" href="/about">
        <img width="64" src="/static/assets/videoRec.png" />
        Video Record
      </a>
    </nav>`
  );
};

export default Home;
