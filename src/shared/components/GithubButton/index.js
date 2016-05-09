import React from 'react';

const GithubButton = (props) => {
  const { user,
          repo,
          type,
          width,
          height,
          count,
          large} = props;
  const src = `https://ghbtns.com/github-btn.html?user=${user}&repo=${repo}&type=${type}${count ? '&count=true' : ''}${large ? '&size=large' : ''}`;

  return (
    <iframe
      src={src}
      frameBorder='0'
      allowTransparency
      scrolling='0'
      width={width}
      height={height}
      style={{border: 'none', width: width, height: height}}>
    </iframe>
  );
};

GithubButton.propTypes = {
  user: React.PropTypes.string.isRequired,
  repo: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['star', 'watch', 'fork', 'follow']).isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  count: React.PropTypes.bool,
  large: React.PropTypes.bool
};

export default GithubButton;
