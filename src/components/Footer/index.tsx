// Libs.
import React from 'react'
// import { isMobile } from 'react-device-detect'
import styled from 'styled-components'

// Hooks.
// import { useTranslation } from 'react-i18next'
// import { useWindowSize } from '../../hooks/useWindowSize'
// Components.
import { RowFixed } from '../Row'
import PairInfo from './PairInfo'

const data = [
  {
    _id: '6049a5432f9c2855457799b7',
    pairName: 'PA1-PA1',
    changeAmount: 27.885373,
    changePercentage: -15.51
  },
  {
    _id: '6049a5433951003a1146f1a4',
    pairName: 'PA2-PA2',
    changeAmount: 77.549591,
    changePercentage: 0.59
  },
  {
    _id: '6049a543b531b77ea5702226',
    pairName: 'PA3-PA3',
    changeAmount: 75.541272,
    changePercentage: -8.9
  },
  {
    _id: '6049a5438fcb9a9a1d026995',
    pairName: 'PA4-PA4',
    changeAmount: 70.774764,
    changePercentage: 12.88
  },
  {
    _id: '6049a543cd3b8af49cdfcfbb',
    pairName: 'PA5-PA5',
    changeAmount: 97.206592,
    changePercentage: -4.25
  },
  {
    _id: '6049a54318417a2849b0fa86',
    pairName: 'PA6-PA6',
    changeAmount: 73.995237,
    changePercentage: -21.17
  },
  {
    _id: '6049a543c8f649c28dc1958f',
    pairName: 'PA7-PA7',
    changeAmount: 22.686879,
    changePercentage: 10.39
  },
  {
    _id: '6049a543edd359adff67df53',
    pairName: 'PA8-PA8',
    changeAmount: 14.938418,
    changePercentage: -5.79
  },
  {
    _id: '6049a543784433750ed1adc8',
    pairName: 'PA9-PA9',
    changeAmount: 29.716898,
    changePercentage: 2.19
  }
]

// const StyledRowFixed = styled(RowFixed)`
//   height: 100%;
//   position: relative;
// `
//
// const ListWrapper = styled.div<{ width: number; left: number }>`
//   height: 100%;
//   position: absolute;
//   display: flex;
//   width: ${({ width }) => (width === -1 ? 'max-content' : width + 'px')};
//   left: ${({ left }) => left + 'px'};
// `
//
// NOTE: This is a practice using javascript for horizontal scroll infinite, it has the downside that the list will be jerky.
// export default function Footer() {
//   // Remove useTranslation() here makes list1Ref.current.clientWidth always equal to 0 ==> BUG.
//   useTranslation()
//   const windowSize = useWindowSize()
//   const list1Ref = React.useRef<HTMLDivElement>(null)
//   const [list1Left, setList1Left] = React.useState(0)
//   const [list2Left, setList2Left] = React.useState(0)
//   const [pause, setPause] = React.useState(false)
//   const [width, setWidth] = React.useState(-1)
//
//   React.useEffect(() => {
//     if (list1Ref.current) {
//       setWidth(list1Ref.current.clientWidth)
//     }
//   }, [])
//
//   React.useEffect(() => {
//     if (width !== -1) {
//       setList1Left(0)
//       setList2Left(width)
//     }
//   }, [width])
//
//   React.useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (width !== -1) {
//       interval = setInterval(() => {
//         if (!pause) {
//           setList1Left(list1Left => list1Left - 0.75)
//           setList2Left(list2Left => list2Left - 0.75)
//         }
//       }, 12)
//     }
//     return () => {
//       if (interval) clearInterval(interval)
//     }
//   }, [width, pause])
//
//   React.useEffect(() => {
//     if (width === -1 || !windowSize.width) return
//
//     if (list1Left <= -width) {
//       setList1Left(Math.max(list2Left + width, windowSize.width))
//     }
//   }, [list1Left, list2Left, width, windowSize])
//
//   React.useEffect(() => {
//     if (width === -1 || !windowSize.width) return
//
//     if (list2Left <= -width) {
//       setList2Left(Math.max(list1Left + width, windowSize.width))
//     }
//   }, [list1Left, list2Left, width, windowSize])
//
//   const getListJSX = React.useMemo(
//     () => (
//       <>
//         {data.slice(0).map(pair => (
//           <PairInfo
//             key={pair._id}
//             pairName={pair.pairName}
//             changeAmount={pair.changeAmount}
//             changePercentage={pair.changePercentage}
//           />
//         ))}
//       </>
//     ),
//     []
//   )
//
//   return (
//     <StyledRowFixed onMouseEnter={() => !isMobile && setPause(true)} onMouseLeave={() => !isMobile && setPause(false)}>
//       <ListWrapper ref={list1Ref} width={width} left={list1Left}>
//         {getListJSX}
//       </ListWrapper>
//       <ListWrapper width={width} left={list2Left}>
//         {getListJSX}
//       </ListWrapper>
//     </StyledRowFixed>
//   )
// }

// NOTE: This is a practice using only CSS, it has the downside that the list cannot be contiguous.
const Marquee = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;

  > * {
    display: inline-block;
    width: max-content;

    padding-left: 100%;
    /* show the marquee just outside the paragraph */
    will-change: transform;
    animation: marquee 60s linear infinite;
  }

  > :hover {
    animation-play-state: paused;
  }

  @keyframes marquee {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }

  /* Respect user preferences about animations */
  @media (prefers-reduced-motion: reduce) {
    > * {
      animation-iteration-count: 1;
      animation-duration: 0.01s;
      /* instead of animation: none, so an animationend event is
       * still available, if previously attached.
       */
      width: auto;
      padding-left: 0;
    }
  }
`

export default function Footer() {
  return (
    <Marquee>
      <div>
        <RowFixed height={'100%'}>
          {data.slice(0).map(pair => (
            <PairInfo
              key={pair._id}
              pairName={pair.pairName}
              changeAmount={pair.changeAmount}
              changePercentage={pair.changePercentage}
            />
          ))}
        </RowFixed>
      </div>
    </Marquee>
  )
}
