package com.performworld.service.user;

import com.performworld.dto.user.UserDTO;

public interface UserService {
    static class MidExistException extends Exception{
    }

    void signUp(UserDTO userDTO) throws MidExistException;  // 회원가입

    UserDTO getUserInfo(UserDTO userDTO);  // 회원정보 조회

    void changePw(UserDTO userDTO);

    void updateUser(UserDTO userDTO);  // 회원정보 수정

    void deleteUser(String userId);  // 회원탈퇴

    void resetPw(String email);

}

