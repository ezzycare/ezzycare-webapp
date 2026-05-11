import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  overflow: hidden;
  position: relative;

  .linear-loader-bar {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #17c9ed85, #17c9ed);
    position: absolute;
    animation: loading 1.5s infinite linear;
    transform: translateX(-100%);
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const LinearLoader = () => {
  return (
    <Wrapper>
      <div className="linear-loader-bar" />
    </Wrapper>
  );
};

export default LinearLoader;
