import { HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "typeorm";
import { ExceptionDataDto } from "./dto/ExceptionData.Dto";

export class HttpExceptionWithData extends HttpException {
    public data
    public logger
    constructor(exception : HttpException, data : ExceptionDataDto) {
      super(exception.message, HttpStatus.FORBIDDEN);
      this.data = data.data;
    }
  }