import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'packageFilter'
})
export class PackageFilterPipe implements PipeTransform {

  transform(list: any[], filterText: string): unknown {
    return list ? list.filter(item => item.name.toLowerCase().search(new RegExp(filterText, 'i')) > -1) : []
  }

}
