import { NotificationModel } from "../models/notification.model.js";

export const getNotifications = async(request, response) => {
    try {
        const {_id: userId} = request.user;


        const notifications = await NotificationModel.find({to: userId}).populate({
            path: "from",
            select: "username profileimg"
        })

        await NotificationModel.updateMany({to: userId}, {read: true});


        return response.status(200).json(notifications)
    } catch (error) {
        console.log("Error in the getNotifications controller", error);
        response.status(500).json({error: "Internal Server Error"})
    }
}


export const deleteNotifications = async(request, response) => {
    try {
        const userId = request.user._id;

        await NotificationModel.deleteMany({to: userId});

        return response.status(200).json({message: "Notifications deleted successfully"})
    } catch (error) {
        console.log("Error in the deleteNotifications controller", error);
        response.status(500).json({error: "Internal Server Error"})
    }
}



// export const deleteOneNotifications = async(request, response) => {
//     try {
//         const notificationId = request.params.id;
//         const userId = request.user._id;

//         const notification = await NotificationModel.findById(notificationId);
//         if(!notification){
//             return response.status(404).json({error: "Notifications not found"})
//         }

//         if(notification.to.toString() !== userId.toString()){
//             return response.status(403).json({error: "You are not allowed to delete this notofication"})
//         }

//         await NotificationModel.findByIdAndDelete(notificationId);

//         return response.status(200).json({message: "Notifications deleted successfully"})
//     } catch (error) {
//         console.log("Error in the deleteNotifications controller", error);
//         response.status(500).json({error: "Internal Server Error"})
//     }
// }

