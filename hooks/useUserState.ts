import { useCallback } from "react"

export interface UserStateData {
  phoneNumber: string
  selectedCarrier: string
  selectedTemplate: any | null
  templateParams: Record<string, string>
}

export interface UserStateActions {
  saveUserState: (userState: UserStateData) => void
  restoreUserState: () => UserStateData | null
}

export const useUserState = (): UserStateActions => {
  
  // 保存用户状态到localStorage
  const saveUserState = useCallback((userState: UserStateData) => {
    const stateToSave = {
      phoneNumber: userState.phoneNumber,
      selectedCarrier: userState.selectedCarrier,
      selectedTemplate: userState.selectedTemplate ? {
        id: userState.selectedTemplate.id,
        name: userState.selectedTemplate.name,
        content: userState.selectedTemplate.content,
        code: userState.selectedTemplate.code,
        params: userState.selectedTemplate.params
      } : null,
      templateParams: userState.templateParams
    }
    localStorage.setItem("sms-user-state", JSON.stringify(stateToSave))
  }, [])

  // 从localStorage恢复用户状态
  const restoreUserState = useCallback((): UserStateData | null => {
    try {
      const savedState = localStorage.getItem("sms-user-state")
      if (savedState) {
        const userState = JSON.parse(savedState)
        return {
          phoneNumber: userState.phoneNumber || "",
          selectedCarrier: userState.selectedCarrier || "",
          selectedTemplate: userState.selectedTemplate || null,
          templateParams: userState.templateParams || {}
        }
      }
    } catch (error) {
      console.error('Failed to restore user state:', error)
      // 仅在开发环境下记录错误详情
      if (process.env.NODE_ENV === 'development') {
        console.error('恢复用户状态失败:', error)
      }
    }
    return null
  }, [])

  return {
    saveUserState,
    restoreUserState,
  }
}