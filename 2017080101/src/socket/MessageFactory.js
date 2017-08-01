var MessageFactory=(function()
{
 var unique;
 function getInstance(){
 return unique || ( unique = new MessageFactoryClass() );
}
return {
getInstance : getInstance
 }
})();
var MessageFactoryClass= function()
{
	this.build=function( msgNumber,buf)
	{
		var responseObj;
 		switch (msgNumber) {
		case ENTER_SCENE_REQUEST:
		{
			responseObj=new EnterSceneRequest();
			responseObj.read(buf);
		}
 		break;
		case ENTER_SCENE_RESPONSE:
		{
			responseObj=new EnterSceneResponse();
			responseObj.read(buf);
		}
 		break;
		case RANDOM_MATCH_REQUEST:
		{
			responseObj=new RandomMatchRequest();
			responseObj.read(buf);
		}
 		break;
		case RANDOM_MATCH_RESPONSE:
		{
			responseObj=new RandomMatchResponse();
			responseObj.read(buf);
		}
 		break;
		case CREATE_ROOM_REQUEST:
		{
			responseObj=new CreateRoomRequest();
			responseObj.read(buf);
		}
 		break;
		case CREATE_ROOM_RESPONSE:
		{
			responseObj=new CreateRoomResponse();
			responseObj.read(buf);
		}
 		break;
		case JOIN_ROOM_REQUEST:
		{
			responseObj=new JoinRoomRequest();
			responseObj.read(buf);
		}
 		break;
		case JOIN_ROOM_RESPONSE:
		{
			responseObj=new JoinRoomResponse();
			responseObj.read(buf);
		}
 		break;
		case PUT_CARD_REQUEST:
		{
			responseObj=new PutCardRequest();
			responseObj.read(buf);
		}
 		break;
		case PUT_CARD_RESPONSE:
		{
			responseObj=new PutCardResponse();
			responseObj.read(buf);
		}
 		break;
		case OPERATE_CARD_REQUEST:
		{
			responseObj=new OperateCardRequest();
			responseObj.read(buf);
		}
 		break;
		case OPERATE_CARD_RESPONSE:
		{
			responseObj=new OperateCardResponse();
			responseObj.read(buf);
		}
 		break;
		case PASS_OPERATE_REQUEST:
		{
			responseObj=new PassOperateRequest();
			responseObj.read(buf);
		}
 		break;
		case PASS_OPERATE_RESPONSE:
		{
			responseObj=new PassOperateResponse();
			responseObj.read(buf);
		}
 		break;
		case READY_REQUEST:
		{
			responseObj=new ReadyRequest();
			responseObj.read(buf);
		}
 		break;
		case READY_RESPONSE:
		{
			responseObj=new ReadyResponse();
			responseObj.read(buf);
		}
 		break;
		case GET_ZHANJI_REQUEST:
		{
			responseObj=new GetZhanJiRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_ZHANJI_RESPONSE:
		{
			responseObj=new GetZhanJiResponse();
			responseObj.read(buf);
		}
 		break;
		case CHECK_OLD_ROOM_REQUEST:
		{
			responseObj=new CheckOldRoomRequest();
			responseObj.read(buf);
		}
 		break;
		case CHECK_OLD_ROOM_RESPONSE:
		{
			responseObj=new CheckOldRoomResponse();
			responseObj.read(buf);
		}
 		break;
		case ACK_REQUEST:
		{
			responseObj=new AckRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_INFO_REQUEST:
		{
			responseObj=new GetInfoRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_INFO_RESPONSE:
		{
			responseObj=new GetInfoResponse();
			responseObj.read(buf);
		}
 		break;
		case GET_RANK_REQUEST:
		{
			responseObj=new GetRankRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_RANK_RESPONSE:
		{
			responseObj=new GetRankResponse();
			responseObj.read(buf);
		}
 		break;
		case MSG_REQUEST:
		{
			responseObj=new MsgRequest();
			responseObj.read(buf);
		}
 		break;
		case MSG_RESPONSE:
		{
			responseObj=new MsgResponse();
			responseObj.read(buf);
		}
 		break;
		case DISMISS_REQUEST:
		{
			responseObj=new DismissRequest();
			responseObj.read(buf);
		}
 		break;
		case DISMISS_RESPONSE:
		{
			responseObj=new DismissResponse();
			responseObj.read(buf);
		}
 		break;
		case DISMISS_SEL_REQUEST:
		{
			responseObj=new DismissSelRequest();
			responseObj.read(buf);
		}
 		break;
		case PLAY_REQUEST:
		{
			responseObj=new PlayRequest();
			responseObj.read(buf);
		}
 		break;
		case PLAY_RESPONSE:
		{
			responseObj=new PlayResponse();
			responseObj.read(buf);
		}
 		break;
		case GET_ROLE_INFO_REQUEST:
		{
			responseObj=new GetRoleInfoRequest();
			responseObj.read(buf);
		}
 		break;
		case PLAY_EFFECT_REQUEST:
		{
			responseObj=new PlayEffectRequest();
			responseObj.read(buf);
		}
 		break;
		case PLAY_EFFECT_RESPONSE:
		{
			responseObj=new PlayEffectResponse();
			responseObj.read(buf);
		}
 		break;
		case ACK_RESPONSE:
		{
			responseObj=new AckResponse();
			responseObj.read(buf);
		}
 		break;
		case FLOWS_ACK_REQUEST:
		{
			responseObj=new FlowsAckRequest();
			responseObj.read(buf);
		}
 		break;
		case BIND_USER_REQUEST:
		{
			responseObj=new BindUserRequest();
			responseObj.read(buf);
		}
 		break;
		case BIND_USER_RESPONSE:
		{
			responseObj=new BindUserResponse();
			responseObj.read(buf);
		}
 		break;
		case BIND_MY_REQUEST:
		{
			responseObj=new BindMyRequest();
			responseObj.read(buf);
		}
 		break;
		case BIND_MY_RESPONSE:
		{
			responseObj=new BindMyResponse();
			responseObj.read(buf);
		}
 		break;
		case SI_SHOU_REQUEST:
		{
			responseObj=new SiShouRequest();
			responseObj.read(buf);
		}
 		break;
		case SI_SHOU_RESPONSE:
		{
			responseObj=new SiShouResponse();
			responseObj.read(buf);
		}
 		break;
		case GET_IP_REQUEST:
		{
			responseObj=new GetIpRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_IP_RESPONSE:
		{
			responseObj=new GetIpResponse();
			responseObj.read(buf);
		}
 		break;
		case DIPAI_REQUEST:
		{
			responseObj=new DiPaiRequest();
			responseObj.read(buf);
		}
 		break;
		case DIPAI_RESPONSE:
		{
			responseObj=new DiPaiResponse();
			responseObj.read(buf);
		}
 		break;
		case SET_TOUCH_REQUEST:
		{
			responseObj=new SetTouchRequest();
			responseObj.read(buf);
		}
 		break;
		case SET_TOUCH_RESPONSE:
		{
			responseObj=new SetTouchResponse();
			responseObj.read(buf);
		}
 		break;
		case GET_ROOMS_REQUEST:
		{
			responseObj=new GetRoomsRequest();
			responseObj.read(buf);
		}
 		break;
		case GET_ROOMS_RESPONSE:
		{
			responseObj=new GetRoomsResponse();
			responseObj.read(buf);
		}
 		break;
		case FLOWS_NOTIFY:
		{
			responseObj=new FlowsNotify();
			responseObj.read(buf);
		}
 		break;
		case ROOM_INFO_NOTIFY:
		{
			responseObj=new RoomInfoNotify();
			responseObj.read(buf);
		}
 		break;
		case FLUSH_ROOM_NOTIFY:
		{
			responseObj=new FlushRoomNotify();
			responseObj.read(buf);
		}
 		break;
		case LEAVE_ROOM_NOTIFY:
		{
			responseObj=new LeaveRoomNotify();
			responseObj.read(buf);
		}
 		break;
		case ROOM_INFO_FLUSH_NOTIFY:
		{
			responseObj=new RoomInfoFlushNotify();
			responseObj.read(buf);
		}
 		break;
		case GAME_FINISHED_NOTIFY:
		{
			responseObj=new GameFinishedNotify();
			responseObj.read(buf);
		}
 		break;
		case OFF_LINE_NOTIFY:
		{
			responseObj=new OffLineNotify();
			responseObj.read(buf);
		}
 		break;
		case ROOM_PLAYER_CARDS_NOTIFY:
		{
			responseObj=new RoomPlayerCardsNotify();
			responseObj.read(buf);
		}
 		break;
		case YUYIN_NOTIFY:
		{
			responseObj=new YuYinNotify();
			responseObj.read(buf);
		}
 		break;
		case DISMISS_NOTIFY:
		{
			responseObj=new DismissNotify();
			responseObj.read(buf);
		}
 		break;
		case GONGGAO_NOTIFY:
		{
			responseObj=new GongGaoNotify();
			responseObj.read(buf);
		}
 		break;
		case ROLEINFO_NOTIFY:
		{
			responseObj=new RoleInfoNotify();
			responseObj.read(buf);
		}
 		break;
		case PLAY_BACK_FINISH_INFO_NOTIFY:
		{
			responseObj=new PlayBackFinishInfoNotify();
			responseObj.read(buf);
		}
 		break;
		case INDEX_HAND_REQUEST:
		{
			responseObj=new IndexHandRequest();
			responseObj.read(buf);
		}
 		break;
		case SERVER_HAND_PAY_REQUEST:
		{
			responseObj=new ServerHandPayRequest();
			responseObj.read(buf);
		}
 		break;
		case SERVER_HAND_PAY_RESPONSE:
		{
			responseObj=new ServerHandPayResponse();
			responseObj.read(buf);
		}
 		break;
		case HEART_SERVER_TO_CLIENT_REQUEST:
		{
			responseObj=new HeartServerToClientRequest();
			responseObj.read(buf);
		}
 		break;
		case HEART_SERVER_TO_CLIENT_RESPONSE:
		{
			responseObj=new HeartServerToClientResponse();
			responseObj.read(buf);
		}
 		break;
		case HEART_CLIENT_TO_SERVER_REQUEST:
		{
			responseObj=new HeartClientToServerRequest();
			responseObj.read(buf);
		}
 		break;
		case HEART_CLIENT_TO_SERVER_RESPONSE:
		{
			responseObj=new HeartClientToServerResponse();
			responseObj.read(buf);
		}
 		break;
		case USER_SESSION_CLOSED:
		{
			responseObj=new UserSessionClosed();
			responseObj.read(buf);
		}
 		break;
		default:
		break;
	}
buf=null;
return responseObj;
}
}
