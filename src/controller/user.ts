const googleCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }

  const kakaoCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }


const naverCallback = function (req, res) {
    res.redirect('https://6065a02c87bc47f3ddd64b74--awesome-goldberg-60d50e.netlify.app');
  }



const getuser = (req, res) => {
  res.send(req.user);
}

const logout = (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
}
export default {getuser, logout, googleCallback, kakaoCallback, naverCallback}