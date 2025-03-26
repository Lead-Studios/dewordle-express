export interface IFollowData {
    follower: string
    following: string
  }
  
  export interface IFollowResponse {
    success: boolean
    message: string
    data?: any
  }
  
  export interface IFollowersResponse {
    followers: any[]
    count: number
  }
  
  export interface IFollowingResponse {
    following: any[]
    count: number
  }
  
  export interface IRecommendedUsersResponse {
    users: any[]
  }
  
  export interface IActivityFeedResponse {
    activities: any[]
    nextCursor?: string
  }
  
  