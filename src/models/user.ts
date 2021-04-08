// import moongoose, { Model, Schema } from 'mongoose'

// const user: Schema = new Schema(
//     {
//         _id: {
//             type: String,
//             maxlength: 5,
//             required : true
//         },
//         googleId: {
//             required: false,
//             type: String
//         },
//         email: {
//             type: String,
//             trim: true,
//             unique: 1,
//             required : true
//         },

//         name: {
//             type: String,
//             maxlength: 50,
//             required : true
//         },

//         img: {type : String, required : true},

//         deleteYN: {type : Boolean, required : true}

       
//     }); 
              
//         /*            // 레퍼런스
//                     "like_list" : [
//                         "item_id"//,.....(워크북 아이디들이 들어간다.)
//                                         //워크북 _id(url이동용), title(목록확인용), 아니면 전부? 
//                     ],
//                     // 레퍼런스
//                     "order_list" : [
//                         "order_id"//,......(주문 내역 아이디들)
//                                         //어떤것들이 필요한지 아직 모르겠음...
//                     ],
//                      */


// const User = moongoose.model('User', user)

// export default User;
import mongoose from 'mongoose';

const user = new mongoose.Schema({
    googleId: {
        required: false,
        type: String
    },
    kakaoId: {
        required: false,
        type: String
    },
    naverId: {
        required: false,
        type: String
    },
    username: {
        required: true,
        type: String
    }
});

export default mongoose.model("User", user);