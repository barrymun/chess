// import { xLabels } from "utils";

// const ChessBoardXLabels = () => {
//   return (
//     <div className="text-white">
//       {[...xLabels].reverse().map((x) => {
//         return (
//           <div key={x} className="w-8 h-100 flex justify-center items-center">
//             {x}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export { ChessBoardXLabels };

import { xLabels } from "utils";

const ChessBoardXLabels = () => {
  return (
    <div className="flex text-white">
      {xLabels.map((x) => {
        return (
          <div key={x} className="w-100 h-8 flex justify-center items-center">
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardXLabels };
